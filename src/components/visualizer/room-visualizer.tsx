"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";

import { ceilingColorOptions, getCeilingColor, roomScene, spotPositions, type LightingSelection } from "./visualizer-data";

export interface RoomSceneDefinition {
  id: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  ceilingMask: string;
  ceilingPath: string;
  ceilingEdgePath: string;
}

export interface RoomVisualizerProps {
  selectedMaterial?: string;
  selectedMaterialLabel?: string;
  selectedColor?: string;
  onColorChange?: (color: string) => void;
  selectedProfile?: string;
  selectedProfileLabel?: string;
  selectedLighting?: readonly LightingSelection[];
  selectedCurtainRail?: string;
  selectedCurtainRailLabel?: string;
}

export function RoomVisualizer({
  selectedMaterial,
  selectedMaterialLabel,
  selectedColor = "white",
  onColorChange,
  selectedProfile,
  selectedProfileLabel,
  selectedLighting = [],
  selectedCurtainRail,
  selectedCurtainRailLabel,
}: RoomVisualizerProps) {
  const t = useTranslations("visualizer");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const materialColor = getCeilingColor(selectedColor);
  const spotCount = selectedLighting
    .filter(({ id }) => id.includes("spot") || id.includes("lamp"))
    .reduce((total, light) => total + light.quantity, 0);
  const visibleSpotCount = Math.min(spotCount, spotPositions.length);
  const ledLineSelected = selectedLighting.some(({ id, quantity }) => id === "led-line" && quantity > 0);
  const magneticRailSelected = selectedLighting.some(({ id, quantity }) => id === "magnetic-rail" && quantity > 0);
  const materialSelected = Boolean(selectedMaterial);

  return (
    <figure className="visualizer-shell">
      <div className="visualizer-scene" aria-busy={!imageLoaded && !imageFailed}>
        {!imageFailed ? (
          <Image
            alt=""
            className="visualizer-base-image"
            fill
            onError={() => setImageFailed(true)}
            onLoad={() => setImageLoaded(true)}
            priority={false}
            sizes="(max-width: 820px) 100vw, 48vw"
            src={roomScene.image}
          />
        ) : null}

        {!imageLoaded && !imageFailed ? <div aria-hidden="true" className="visualizer-loading" /> : null}
        {imageFailed ? <div className="visualizer-fallback" role="status">{t("sceneUnavailable")}</div> : null}

        {!imageFailed ? (
          <svg
            aria-label={t("sceneAlt", { material: selectedMaterialLabel ?? t("concrete"), color: t(`colors.${selectedColor}`) })}
            className="visualizer-layers"
            role="img"
            viewBox={`0 0 ${roomScene.imageWidth} ${roomScene.imageHeight}`}
          >
            <defs>
              <linearGradient id="ceiling-base" x1="0" x2=".7" y1="0" y2="1">
                <stop offset="0" stopColor={materialColor} />
                <stop offset="1" stopColor={materialColor} stopOpacity=".92" />
              </linearGradient>
              <linearGradient id="ceiling-sheen" x1="0" x2="1" y1="0" y2=".25">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset=".48" stopColor="#fff" stopOpacity=".46" />
                <stop offset=".56" stopColor="#fff" stopOpacity=".14" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="led-glow" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#fff3c9" stopOpacity=".9" />
                <stop offset="1" stopColor="#f5ca73" stopOpacity="0" />
              </linearGradient>
              <filter id="soft-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="8" />
              </filter>
              <mask id="ceiling-mask" maskContentUnits="userSpaceOnUse" x="0" y="0" width={roomScene.imageWidth} height={roomScene.imageHeight}>
                <rect width={roomScene.imageWidth} height={roomScene.imageHeight} fill="#000" />
                <image href={roomScene.ceilingMask} width={roomScene.imageWidth} height={roomScene.imageHeight} />
                <path d={roomScene.ceilingPath} fill="#fff" />
              </mask>
              <clipPath id="ceiling-clip">
                <path d={roomScene.ceilingPath} />
              </clipPath>
            </defs>

            {materialSelected ? (
              <g mask="url(#ceiling-mask)">
                <rect width={roomScene.imageWidth} height={roomScene.imageHeight} fill="url(#ceiling-base)" />
                {selectedMaterial === "matte" ? <rect width={roomScene.imageWidth} height={roomScene.imageHeight} fill="#d4d0c7" opacity=".035" /> : null}
                {selectedMaterial === "satin" ? (
                  <path d="M 290 0 H 680 L 1180 322 H 850 Z" fill="url(#ceiling-sheen)" opacity=".5" />
                ) : null}
                {selectedMaterial?.includes("gloss") ? (
                  <path d="M 65 0 H 430 L 1080 322 H 710 Z" fill="url(#ceiling-sheen)" opacity=".72" />
                ) : null}
                {selectedMaterial === "print" ? (
                  <g clipPath="url(#ceiling-clip)" fill="none" opacity=".16" stroke="#54645d" strokeWidth="3">
                    <path d="M 260 25 C 470 95 610 85 790 158 S 1110 222 1320 180" />
                    <path d="M 140 105 C 390 180 580 155 770 220 S 1110 286 1325 235" />
                    <path d="M 220 10 C 440 70 580 70 740 135 S 1040 190 1290 150" />
                  </g>
                ) : null}
                {selectedMaterial === "starry-sky" ? (
                  <g clipPath="url(#ceiling-clip)" fill="#fff7d9">
                    {[[320, 90], [505, 65], [690, 130], [860, 55], [1040, 155], [1220, 75], [445, 230], [760, 265], [1100, 215], [930, 100]].map(([cx, cy], index) => (
                      <circle cx={cx} cy={cy} key={`${cx}-${cy}-${index}`} opacity={index % 2 ? ".52" : ".9"} r={index % 3 ? "3" : "5"} />
                    ))}
                  </g>
                ) : null}
              </g>
            ) : null}

            {selectedProfile ? (
              <g clipPath="url(#ceiling-clip)">
                {selectedProfile === "illuminated" ? <path d={roomScene.ceilingEdgePath} fill="none" filter="url(#soft-glow)" stroke="#fff0bf" strokeWidth="22" opacity=".85" /> : null}
                {selectedProfile === "shadow-standard" ? <path d={roomScene.ceilingEdgePath} fill="none" stroke="#55534d" strokeWidth="9" opacity=".8" /> : null}
                {selectedProfile !== "shadow-standard" ? <path d={roomScene.ceilingEdgePath} fill="none" stroke={selectedProfile === "illuminated" ? "#fff4d5" : "#f8f6ef"} strokeWidth="6" opacity=".92" /> : null}
                <path d={roomScene.ceilingEdgePath} fill="none" stroke="#554f46" strokeWidth="1.5" opacity=".36" />
              </g>
            ) : null}

            {spotPositions.slice(0, visibleSpotCount).map(([cx, cy], index) => (
              <g key={`spot-${index}`}>
                <circle cx={cx} cy={cy} fill="#f9edc8" filter="url(#soft-glow)" opacity=".6" r="16" />
                <circle cx={cx} cy={cy} fill="#f4f0e5" stroke="#827d72" strokeWidth="4" r="9" />
                <circle cx={cx} cy={cy} fill="#fffdf4" r="4" />
              </g>
            ))}

            {ledLineSelected ? (
              <g clipPath="url(#ceiling-clip)">
                <path d="M 506 235 H 1160" fill="none" filter="url(#soft-glow)" stroke="#ffe9ae" strokeWidth="24" opacity=".7" />
                <path d="M 506 235 H 1160" fill="none" stroke="url(#led-glow)" strokeWidth="8" />
                <path d="M 506 235 H 1160" fill="none" stroke="#fffdf4" strokeWidth="2" />
              </g>
            ) : null}

            {magneticRailSelected ? (
              <g clipPath="url(#ceiling-clip)">
                <path d="M 490 278 H 1178" fill="none" stroke="#383c3b" strokeLinecap="round" strokeWidth="13" />
                <path d="M 505 278 H 1163" fill="none" stroke="#eee9dc" strokeWidth="2" />
              </g>
            ) : null}

            {selectedCurtainRail === "standard" ? (
              <g>
                <path d="M 490 359 H 884" fill="none" stroke="#514d45" strokeWidth="8" />
                <path d="M 520 357 V 376 M 850 357 V 376" fill="none" stroke="#514d45" strokeWidth="4" />
              </g>
            ) : null}
            {selectedCurtainRail === "concealed-premium" || selectedCurtainRail === "luxury" ? (
              <g>
                <path d="M 474 339 H 1193" fill="none" stroke="#6b665c" strokeWidth="4" />
                <path d="M 474 344 H 1193" fill="none" stroke="#fff" strokeWidth="2" opacity=".75" />
              </g>
            ) : null}
          </svg>
        ) : null}

        {!imageFailed && !imageLoaded ? <span className="visualizer-loading-label">{t("loading")}</span> : null}
        <span className="visualizer-scene-badge">{t("illustrative")}</span>
      </div>

      {onColorChange && materialSelected ? (
        <fieldset className="visualizer-colors">
          <legend>{t("colorTitle")}</legend>
          <div className="visualizer-color-list">
            {ceilingColorOptions.map((option) => (
              <button
                aria-label={t(option.key)}
                aria-pressed={selectedColor === option.id}
                className={`visualizer-color-swatch ${selectedColor === option.id ? "is-selected" : ""}`}
                key={option.id}
                onClick={() => onColorChange(option.id)}
                style={{ "--swatch-color": option.color } as CSSProperties}
                type="button"
              >
                <span aria-hidden="true" />
                <span>{t(option.key)}</span>
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      <dl aria-label={t("selectionTitle")} aria-live="polite" className="visualizer-selection">
        <div><dt>{t("materialLabel")}</dt><dd>{selectedMaterialLabel ?? t("concrete")}{materialSelected ? ` · ${t(`finishes.${selectedMaterial}`)} · ${t(`colors.${selectedColor}`)}` : ""}</dd></div>
        <div><dt>{t("profileLabel")}</dt><dd>{selectedProfileLabel ?? t("noneSelected")}</dd></div>
        <div><dt>{t("lightingLabel")}</dt><dd>{selectedLighting.filter(({ quantity }) => quantity > 0).map(({ id, quantity }) => `${t(`lights.${id}`)} × ${quantity}`).join(", ") || t("noneSelected")}</dd></div>
        <div><dt>{t("railLabel")}</dt><dd>{selectedCurtainRail === "none" ? t("noneSelected") : selectedCurtainRailLabel ?? t("noneSelected")}</dd></div>
      </dl>
      <figcaption className="visualizer-caption">{t("caption")}</figcaption>
    </figure>
  );
}
