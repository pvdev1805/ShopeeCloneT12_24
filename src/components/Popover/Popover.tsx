import { type ElementType, useId, useRef, useState } from 'react'
import { arrow, FloatingPortal, offset, shift, useFloating } from '@floating-ui/react'
import { motion, AnimatePresence } from 'motion/react'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?: ElementType
  initialOpen?: boolean
}

const Popover = ({ children, renderPopover, className, as: Element = 'div', initialOpen }: Props) => {
  const [isOpen, setIsOpen] = useState(initialOpen || false)

  const arrowRef = useRef<HTMLDivElement>(null)

  const { x, y, strategy, refs, floatingStyles, middlewareData } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(6),
      shift(),
      arrow({
        element: arrowRef
      })
    ]
  })

  const id = useId()

  const showPopover = () => {
    setIsOpen(true)
  }

  const hidePopover = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Element className={className} ref={refs.setReference} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
        {children}

        <FloatingPortal id={id}>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={refs.setFloating}
                style={{
                  ...floatingStyles,
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                  transformOrigin: `${middlewareData.arrow?.x}px top`
                }}
                initial={{ opacity: 0, transform: 'scale(0)' }}
                animate={{ opacity: 1, transform: 'scale(1)' }}
                exit={{ opacity: 0, transform: 'scale(0)' }}
                transition={{ duration: 0.2 }}
              >
                <div
                  ref={arrowRef}
                  style={{
                    position: 'absolute',
                    left: middlewareData.arrow?.x,
                    top: middlewareData.arrow?.y
                  }}
                  className='border-x-transparent border-t-transparent border-b-white border-[11px] translate-y-[-94%] z-[1]'
                />

                {renderPopover}
              </motion.div>
            )}
          </AnimatePresence>
        </FloatingPortal>
      </Element>
    </>
  )
}

export default Popover
