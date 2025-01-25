import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer'
import RegisterHeader from '../../components/RegisterHeader'
import { memo } from 'react'

interface Props {
  children?: React.ReactNode
}

const RegisterLayoutInner = ({ children }: Props) => {
  return (
    <>
      <div>
        <RegisterHeader />
        {children}
        <Outlet />
        <Footer />
      </div>
    </>
  )
}

const RegisterLayout = memo(RegisterLayoutInner)

export default RegisterLayout
