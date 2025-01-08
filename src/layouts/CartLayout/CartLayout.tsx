import CartHeader from '../../components/CartHeader'
import Footer from '../../components/Footer'

interface Props {
  children?: React.ReactNode
}

const CartLayout = ({ children }: Props) => {
  return (
    <>
      <CartHeader />
      {children}
      <Footer />
    </>
  )
}

export default CartLayout
