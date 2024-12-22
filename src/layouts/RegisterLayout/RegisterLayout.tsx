interface Props {
  children?: React.ReactNode
}

const RegisterLayout = ({ children }: Props) => {
  return (
    <>
      <div>
        Register Layout
        {children}
      </div>
    </>
  )
}

export default RegisterLayout
