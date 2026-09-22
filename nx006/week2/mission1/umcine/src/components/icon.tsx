export function Icon({ name }: { name: string }) {
  return <img className="icon" src={`/figma/${name}.svg`} alt="" />
}
