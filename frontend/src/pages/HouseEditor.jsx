import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stage, Layer, Image as KonvaImage, Transformer, Rect } from "react-konva";

import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import useHistory from "../hooks/useHistory";
import compressImage from "../utils/compressImage";
import {
  partToDataUri,
  partSize,
  isRecolorable,
  defaultTint,
  layerSrc,
} from "../utils/houseParts";

const CANVAS = { width: 600, height: 600 };
const STAGE_MAX = 540;
const VIEW_SCALE = STAGE_MAX / Math.max(CANVAS.width, CANVAS.height);

let layerSeq = 0;
const newId = () => `lyr_${Date.now().toString(36)}_${layerSeq++}`;

// A starter house so a blank editor isn't empty.
function starterDesign() {
  const mk = (assetId, x, y, z) => {
    const { width, height } = partSize(assetId);
    return {
      id: newId(),
      type: "asset",
      assetId,
      x,
      y,
      width,
      height,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      tint: isRecolorable(assetId) ? defaultTint(assetId) : null,
      z,
    };
  };
  return {
    version: 2,
    canvas: { ...CANVAS, background: "#cfe9f2" },
    layers: [
      mk("ground_grass", 300, 540, 0),
      mk("wall_box", 300, 400, 1),
      mk("roof_gable", 300, 250, 2),
      mk("window_square", 235, 370, 3),
      mk("door_classic", 320, 452, 4),
    ],
  };
}

// Loads a data-URI/string src into an HTMLImageElement for Konva.
function useImage(src) {
  const [img, setImg] = useState(null);
  useEffect(() => {
    if (!src) return undefined;
    const im = new window.Image();
    im.src = src;
    im.onload = () => setImg(im);
    return () => {
      im.onload = null;
    };
  }, [src]);
  return img;
}

function LayerImage({ layer, onSelect, onChange, registerRef }) {
  const img = useImage(layerSrc(layer));
  const ref = useRef(null);

  useEffect(() => {
    registerRef(layer.id, ref.current);
    return () => registerRef(layer.id, null);
  }, [img, layer.id, registerRef]);

  if (!img) return null;

  return (
    <KonvaImage
      ref={ref}
      image={img}
      x={layer.x}
      y={layer.y}
      width={layer.width}
      height={layer.height}
      offsetX={layer.width / 2}
      offsetY={layer.height / 2}
      rotation={layer.rotation}
      scaleX={layer.scaleX}
      scaleY={layer.scaleY}
      opacity={layer.opacity}
      draggable
      onMouseDown={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      onTransformEnd={(e) => {
        const n = e.target;
        onChange({
          x: n.x(),
          y: n.y(),
          rotation: n.rotation(),
          scaleX: n.scaleX(),
          scaleY: n.scaleY(),
        });
      }}
    />
  );
}

export default function HouseEditor() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    state: design,
    set: setDesign,
    reset: resetHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory(null);
  const [selectedId, setSelectedId] = useState(null);
  const [catalog, setCatalog] = useState({ categories: [], assets: [] });
  const [status, setStatus] = useState("");

  const refsMap = useRef({});
  const trRef = useRef(null);

  // Load catalog + existing house design.
  useEffect(() => {
    api.get("/assets", { auth: false }).then(setCatalog).catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;
    api
      .get(`/houses/${user._id}`)
      .then((data) => {
        const d = data.house?.design;
        resetHistory(d?.version === 2 ? d : starterDesign());
      })
      .catch(() => resetHistory(starterDesign()));
  }, [user, resetHistory]);

  // Keyboard: Ctrl/Cmd+Z = undo, Ctrl/Cmd+Shift+Z (or Ctrl+Y) = redo.
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      if (key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  // Attach the transformer to the selected node.
  useEffect(() => {
    const tr = trRef.current;
    if (!tr) return;
    const node = selectedId ? refsMap.current[selectedId] : null;
    tr.nodes(node ? [node] : []);
    tr.getLayer()?.batchDraw();
  }, [selectedId, design]);

  const registerRef = (id, node) => {
    if (node) refsMap.current[id] = node;
    else delete refsMap.current[id];
  };

  if (!design) return <p className="page muted">Loading editor…</p>;

  const selected = design.layers.find((l) => l.id === selectedId) || null;

  const updateLayer = (id, patch) =>
    setDesign((d) => ({
      ...d,
      layers: d.layers.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));

  const addAsset = (asset) => {
    const { width, height } = partSize(asset.id);
    const maxZ = design.layers.reduce((m, l) => Math.max(m, l.z || 0), 0);
    const layer = {
      id: newId(),
      type: "asset",
      assetId: asset.id,
      x: CANVAS.width / 2,
      y: CANVAS.height / 2,
      width,
      height,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      tint: asset.recolorable ? asset.defaultTint || defaultTint(asset.id) : null,
      z: maxZ + 1,
    };
    setDesign((d) => ({ ...d, layers: [...d.layers, layer] }));
    setSelectedId(layer.id);
  };

  const addUpload = async (file) => {
    if (!file) return;
    setStatus("Processing image…");
    try {
      const { dataUrl, width, height } = await compressImage(file);
      // Fit the image so its longest side is ~200px on the canvas.
      const fit = 200 / Math.max(width, height);
      const maxZ = design.layers.reduce((m, l) => Math.max(m, l.z || 0), 0);
      const layer = {
        id: newId(),
        type: "upload",
        src: dataUrl,
        x: CANVAS.width / 2,
        y: CANVAS.height / 2,
        width: Math.round(width * fit),
        height: Math.round(height * fit),
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        z: maxZ + 1,
      };
      setDesign((d) => ({ ...d, layers: [...d.layers, layer] }));
      setSelectedId(layer.id);
      setStatus("Image added. Drag, scale, or rotate it.");
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  const deleteSelected = () => {
    if (!selected) return;
    setDesign((d) => ({ ...d, layers: d.layers.filter((l) => l.id !== selected.id) }));
    setSelectedId(null);
  };

  const restack = (dir) => {
    if (!selected) return;
    const sorted = [...design.layers].sort((a, b) => a.z - b.z);
    const idx = sorted.findIndex((l) => l.id === selected.id);
    const swap = idx + dir;
    if (swap < 0 || swap >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swap];
    updateLayer(a.id, { z: b.z });
    updateLayer(b.id, { z: a.z });
  };

  const save = async () => {
    setStatus("Saving…");
    try {
      await api.put("/houses/me", { design });
      setStatus("Saved! Your house is updated.");
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  const resetClassic = async () => {
    setStatus("Resetting…");
    try {
      await api.put("/houses/me", { design: null });
      setStatus("Reset to the classic house.");
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  const ordered = [...design.layers].sort((a, b) => a.z - b.z);

  return (
    <div className="page">
      <div className="editor-head">
        <h1>House Editor</h1>
        <div className="editor-actions">
          <button className="ghost" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            Undo
          </button>
          <button className="ghost" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
            Redo
          </button>
          <button onClick={save}>Save</button>
          <button className="ghost" onClick={resetClassic}>
            Reset to classic
          </button>
          <button className="ghost" onClick={() => navigate("/my-house")}>
            Done
          </button>
        </div>
      </div>
      {status && <p className="muted">{status}</p>}

      <div className="editor-grid">
        {/* Asset library */}
        <div className="card editor-library">
          <h2>Parts</h2>
          <label className="upload-btn">
            Upload image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                addUpload(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          <p className="upload-hint muted">
            Save a picture (e.g. from Pinterest) to your device, then upload it.
          </p>
          {catalog.categories.map((cat) => (
            <div key={cat} className="lib-group">
              <div className="label">{cat}</div>
              <div className="lib-items">
                {catalog.assets
                  .filter((a) => a.category === cat)
                  .map((a) => (
                    <button
                      key={a.id}
                      className="lib-item"
                      title={a.name}
                      onClick={() => addAsset(a)}
                    >
                      <img src={partToDataUri(a.id, a.defaultTint)} alt={a.name} />
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div className="editor-canvas-wrap">
          <Stage
            width={CANVAS.width * VIEW_SCALE}
            height={CANVAS.height * VIEW_SCALE}
            scaleX={VIEW_SCALE}
            scaleY={VIEW_SCALE}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) setSelectedId(null);
            }}
            style={{ borderRadius: 8, boxShadow: "var(--shadow)" }}
          >
            <Layer>
              <Rect
                x={0}
                y={0}
                width={CANVAS.width}
                height={CANVAS.height}
                fill={design.canvas.background}
                listening={false}
              />
              {ordered.map((l) => (
                <LayerImage
                  key={l.id}
                  layer={l}
                  onSelect={() => setSelectedId(l.id)}
                  onChange={(patch) => updateLayer(l.id, patch)}
                  registerRef={registerRef}
                />
              ))}
              <Transformer ref={trRef} rotateEnabled keepRatio={false} />
            </Layer>
          </Stage>
        </div>

        {/* Properties */}
        <div className="card editor-props">
          <h2>Layer</h2>
          {!selected && <p className="muted">Click a part to edit it.</p>}
          {selected && (
            <div className="stack">
              {isRecolorable(selected.assetId) && (
                <label>
                  Color
                  <input
                    type="color"
                    value={selected.tint || defaultTint(selected.assetId)}
                    onChange={(e) => updateLayer(selected.id, { tint: e.target.value })}
                  />
                </label>
              )}
              <label>
                Opacity
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={selected.opacity}
                  onChange={(e) =>
                    updateLayer(selected.id, { opacity: Number(e.target.value) })
                  }
                />
              </label>
              <div className="prop-row">
                <button
                  className="ghost"
                  onClick={() =>
                    updateLayer(selected.id, { scaleX: -selected.scaleX })
                  }
                >
                  Flip
                </button>
                <button className="ghost" onClick={() => restack(1)}>
                  Forward
                </button>
                <button className="ghost" onClick={() => restack(-1)}>
                  Back
                </button>
              </div>
              <button className="danger-btn" onClick={deleteSelected}>
                Delete part
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
