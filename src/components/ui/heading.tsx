interface HeadingProps {
  title: String
  description: String
}

const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
        {title}
      </h2>
      <p className="text-xs text-muted-foreground sm:text-sm md:text-base md:leading-7">
        {description}
      </p>
    </div>
  )
}

export default Heading
