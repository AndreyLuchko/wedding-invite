import Image from 'next/image'

interface FlowerDividerProps {
  src?: string
  flip?: boolean
}

export function FlowerDivider({
  src = '/gallery/flowers_4x3.png',
  flip = false,
}: FlowerDividerProps) {
  return (
    <div className="relative w-full h-27.5 overflow-hidden" aria-hidden="true">
      <Image
        src={src}
        alt=""
        fill
        className={`object-cover object-center ${flip ? '-scale-x-100' : ''}`}
      />
      <div className="absolute inset-x-0 top-0 h-[45%] bg-linear-to-b from-cream to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-linear-to-t from-cream to-transparent" />
    </div>
  )
}
