'use client'

import { useCallback, useState } from 'react'
import ImageUploader from '@/app/_components/ImageUploader'
import SampleImagePreview from '@/app/_components/SampleImagePreview'
import Welcome from '@/app/_components/Welcome'
import ImageAnalyzer from '@/app/_components/ImageAnalyzer'
import { ImageUploadInfo } from '@/app/types'

const ImageAnalyzerRoot = () => {
  const [images, setImages] = useState<ImageUploadInfo[]>([])

  const processFiles = useCallback(
    (images: ImageUploadInfo[]) => {
      if (images.length > 0) setImages(images)
    },
    [setImages]
  )

  return (
    <main>
      <Welcome />
      <div>
        <h1>Try it out</h1>
        <ImageUploader onUpload={processFiles} />
      </div>
      {images.length <= 0 && (
        <SampleImagePreview imageSource="/images/sample.jpg" />
      )}
      {images.length > 0 && (
        <div>
          <h1>Analysis Results</h1>
          {images.map((data, index) => (
            <ImageAnalyzer key={index} {...data} />
          ))}
        </div>
      )}
    </main>
  )
}

export default ImageAnalyzerRoot
