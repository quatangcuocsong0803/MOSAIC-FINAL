import Image from "next/image";
import styles from "./ProfileOnboardingWizard.module.css";

// Three accents per step, in addition to the shared picture-frame ornaments.
const scenes = [
  ["cherubs", "flower-vase", "dove"],
  ["flying-figure-1", "bouquet", "fan"],
  ["flying-figure-2", "rococo-cup", "dove"],
  ["floral-house", "peacock", "bouquet"],
  ["chandelier", "flower-vase", "cherubs"],
  ["ornate-vase", "fan", "flying-figure-1"],
  ["bouquet", "peacock", "rococo-cup"],
  ["flying-figure-2", "ornate-vase", "chandelier"],
] as const;

const dimensions: Record<string, [number, number]> = {
  cherubs: [735, 490], "flower-vase": [736, 736], dove: [736, 736],
  "flying-figure-1": [735, 404], bouquet: [736, 937], fan: [736, 736],
  "flying-figure-2": [734, 423], "rococo-cup": [736, 1191],
  "floral-house": [735, 911], peacock: [521, 907],
  chandelier: [736, 736], "ornate-vase": [621, 1000],
};

export function OnboardingSceneDecorations({ step }: { step: number }) {
  return <div className={styles.scene} aria-hidden="true">
    {scenes[step]?.map((name, index) => <Image
      key={name}
      src={`/onboarding/${name}.webp`}
      width={dimensions[name][0]}
      height={dimensions[name][1]}
      alt=""
      unoptimized
      draggable={false}
      className={`${styles.sticker} ${styles[`sticker${index + 1}`]}`}
    />)}
  </div>;
}

export function OnboardingFrameOrnaments() {
  return <div className={styles.frameOrnaments} aria-hidden="true">
    {/* The supplied original is a bottom-left corner. Mirror it with CSS,
        keeping the ornament itself upright along each matching frame edge. */}
    {["topLeft", "topRight", "bottomLeft", "bottomRight"].map((corner) => <Image
      key={corner}
      src="/onboarding/frame-corner.webp"
      width={735}
      height={735}
      alt=""
      unoptimized
      draggable={false}
      className={`${styles.frameCorner} ${styles[corner]}`}
    />)}
    <span className={styles.crestWindow}>
      <Image src="/onboarding/frame-crest.webp" width={735} height={472} alt="" unoptimized draggable={false} className={styles.crest} />
    </span>
  </div>;
}
