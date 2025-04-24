interface ProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default ProtectedLayout
