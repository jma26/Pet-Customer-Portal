import { useEffect, useRef } from 'react'
import { useFetcher } from 'react-router';

type ModalProps = {
  triggerLabel: string
  title: string
  description?: string
  children: (fetcher: ReturnType<typeof useFetcher>) =>React.ReactNode
}

export default function Modal({
  triggerLabel,
  title,
  description,
  children,
}: ModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null)
  const fetcher = useFetcher()

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.status) {
      console.log('fetcher data', fetcher.data);
      fetcher.reset();
      modalRef.current?.close()
    }
  }, [fetcher.state, fetcher.data])

  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() => modalRef.current?.showModal()}
      >
        {triggerLabel}
      </button>
      <dialog className="modal" ref={modalRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          {description && <p className="py-2">{description}</p>}
          {children(fetcher)}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button />
        </form>
      </dialog>
    </>
  )
}
