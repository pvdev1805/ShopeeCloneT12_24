import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import { memo } from 'react'

interface Props {
  children?: React.ReactNode
}

const MainLayoutInner = ({ children }: Props) => {
  return (
    <>
      <div>
        <Header />
        {children}
        <Outlet />
        <Footer />
      </div>
    </>
  )
}

const MainLayout = memo(MainLayoutInner)

export default MainLayout
