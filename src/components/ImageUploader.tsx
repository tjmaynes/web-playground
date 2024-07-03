import { useState, useRef, ChangeEvent, useCallback, DragEvent } from 'react'
import { ErrorContainer } from './ErrorContainer'
import { ImageUploadInfo } from '../types'

const imageMimeType = /image\/(png|jpg|jpeg|webp)/i

enum ImageUploaderError {
  InvalidFileType = 'Invalid file type',
}

type ImageUploaderProps = {
  onUpload: (images: ImageUploadInfo[]) => void
}

export const ImageUploader = ({ onUpload }: ImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadError, setUploadError] = useState<ImageUploaderError | null>(
    null
  )
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = useCallback(
    (rawImageFiles: FileList) => {
      const images: ImageUploadInfo[] = []
      for (let i = 0; i < rawImageFiles.length; i++) {
        if (!rawImageFiles[i].type.match(imageMimeType)) {
          setUploadError(ImageUploaderError.InvalidFileType)
          return
        }
        images.push({
          imageId: rawImageFiles[i].name,
          imageBlob: rawImageFiles[i],
        })
      }

      onUpload(images)

      setIsLoading(false)
    },
    [onUpload]
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    setIsLoading(true)

    if (e.target.files && e.target.files[0]) handleFiles(e.target.files)
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  const handleDrag = (
    e: DragEvent<HTMLDivElement> | DragEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (
    e: DragEvent<HTMLDivElement> | DragEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    e.stopPropagation()

    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0])
      handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="flex justify-center mt-10">
      <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          id="image-upload"
          name="image-upload"
          multiple={true}
          onChange={(e) => handleChange(e)}
        />
        <label
          htmlFor="image-upload"
          className="flex justify-center w-full h-32 px-4 transition border-4 border-blue-500 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-600 focus:outline-none"
        >
          <span>Drop images for analysis</span>
          <span>or</span>
          <button
            aria-busy={isLoading ? 'true' : 'false'}
            onClick={() => onButtonClick()}
          >
            Choose images for analysis
          </button>
        </label>
        {dragActive && (
          <div
            id="drag-file-element"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </form>
      {uploadError && uploadError === ImageUploaderError.InvalidFileType && (
        <ErrorContainer
          errors={['Unable to upload non-png|jpg|jpeg|webp file.']}
        />
      )}
    </div>
  )
}
