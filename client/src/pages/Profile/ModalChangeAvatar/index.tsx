import React, { useRef, useState } from 'react'
import { useAppDispatch } from '~/hooks/redux'
import { User } from '~/types/user'
import DefaultAvatar from '~/assets/images/defaultAvatar.png'

type props = {
  urlAvatar: string
  user: User
}
const FILE_TOO_BIG = 1
const FILE_IS_NOT_SUPPORT = 2
const FILE_IS_EMPTY = 3
const FILE_SUPPORT = ['image/jpeg', 'image/png']
const ModalChangeAvatar: React.FC<props> = (props) => {
  const dispatch = useAppDispatch()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const avatarRef = useRef<HTMLImageElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [errorImage, setErrorImage] = useState<number>(FILE_IS_EMPTY)
  const openModal = () => {
    if (dialogRef.current) {
      setErrorImage(0)
      dialogRef.current.showModal()
    }
  }

  const closeModal = () => {
    if (dialogRef.current) {
      setErrorImage(0)
      dialogRef.current.close()
      if (avatarRef.current!.src) {
        avatarRef.current!.src = props.urlAvatar
      }
      if (inputRef.current!.value) {
        inputRef.current!.value = ''
      }
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files![0]
    if (file) {
      if (avatarRef.current!.src) {
        avatarRef.current!.src = URL.createObjectURL(file)
        if (file.size >= 1024 * 1024 * 5) {
          setErrorImage(FILE_TOO_BIG)
        } else if (!FILE_SUPPORT.includes(file.type)) {
          setErrorImage(FILE_IS_NOT_SUPPORT)
        } else {
          setErrorImage(0)
        }
      }
    } else {
      setErrorImage(FILE_IS_EMPTY)
      avatarRef.current!.src = props.urlAvatar
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inputRef.current!.value) {
      const formData = new FormData()
      formData.set('avatar', inputRef.current?.files?.[0] as File)
      formData.set('displayName', (props.user.displayName as string) || '')
      formData.set('phone', props.user.phone as string)
      formData.set('address', props.user.address as string)
      formData.set('gender', props.user.gender as string)
      // @ts-ignore
      //   const result = await dispatch(updateInformation(formData))
    } else {
      setErrorImage(FILE_IS_EMPTY)
    }
  }
  return (
    <>
      <div className=''>
        <img
          ref={avatarRef}
          src={props.user.avatar || DefaultAvatar}
          alt='Avatar'
          className='object-cover rounded-full cursor-pointe w-48 h-48 cursor-pointer border-2'
          onClick={openModal}
        />
        <p className='text-center italic'>Maximum file size is 1 MB</p>
        <p className='text-center italic'>Format: .JPEG, .PNG</p>
      </div>
      <dialog ref={dialogRef} className='modal text-center p-2 container'>
        <form className='modal-box' onSubmit={handleSubmit}>
          <img
            ref={avatarRef}
            src={props.user.avatar || DefaultAvatar}
            alt='Avatar'
            className='w-52 h-52 my-4 object-cover rounded-full mx-auto border-2'
          />

          <input
            ref={inputRef}
            accept='.jpg, .png'
            type='file'
            className='file-input file-input-bordered file-input-success w-full max-w-xs'
            onChange={handleFileInputChange}
          />
          {errorImage === FILE_TOO_BIG ? (
            <p className={`text-error italic font-medium mt-1`}>Size of the image is less than 4MB</p>
          ) : (
            <></>
          )}
          {errorImage === FILE_IS_NOT_SUPPORT ? (
            <p className={`text-error italic font-medium mt-1`}>File is not support</p>
          ) : (
            <></>
          )}
          {errorImage === FILE_IS_EMPTY ? <p className={`text-error italic font-medium mt-1`}>File is Empty</p> : <></>}
          <div className='modal-action flex justify-center'>
            <button className={`btn text-lg`} type='button' onClick={closeModal}>
              Close
            </button>
            <button className={`btn btn-success text-lg`} type='submit'>
              Save
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}

export default ModalChangeAvatar
