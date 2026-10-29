export function Icon({ name }: { name: string }) {
  return <img className="block shrink-0" src={`/figma/${name}.svg`} alt="" />
}
