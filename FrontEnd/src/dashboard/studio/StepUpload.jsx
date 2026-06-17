import { useRef } from 'react'
import { PhotoIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function StepUpload({ state, dispatch }) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Create a mock object url or just mock the file data
      const url = URL.createObjectURL(file)
      dispatch({ 
        type: 'SET_UPLOADED_IMAGE', 
        payload: { 
          url, 
          name: file.name, 
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB' 
        } 
      })
    }
  }

  const triggerSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <h2 className="text-xl font-bold text-[#0F172A] mb-2">Upload Your Product Photo</h2>
        <p className="text-gray-500 text-sm mb-8">Clear, well-lit photos work best. JPG or PNG.</p>

        {!state.uploadedImage ? (
          <div 
            onClick={triggerSelect}
            className="border-2 border-dashed border-gray-200 hover:border-[#FF2D20]/50 hover:bg-[#FF2D20]/5 rounded-xl p-16 cursor-pointer transition-colors flex flex-col items-center justify-center group"
          >
            <PhotoIcon className="w-12 h-12 text-gray-400 mb-4 group-hover:text-[#FF2D20] transition-colors" />
            <p className="text-gray-700 font-medium mb-1">Drop your image here</p>
            <p className="text-sm text-gray-500">
              or <span className="text-[#FF2D20] underline decoration-[#FF2D20]/30 underline-offset-2">click to browse</span>
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <img 
              src={state.uploadedImage.url} 
              alt="Uploaded product" 
              className="rounded-xl max-h-[320px] object-contain border border-gray-100 mb-4"
            />
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              {state.uploadedImage.name} <span className="text-gray-400 font-normal">({state.uploadedImage.size})</span>
            </div>
            <button 
              onClick={() => dispatch({ type: 'SET_UPLOADED_IMAGE', payload: null })}
              className="text-sm text-gray-500 hover:text-[#0F172A] underline underline-offset-2 transition-colors"
            >
              Choose Different Image
            </button>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/png, image/jpeg, image/jpg" 
          className="hidden" 
        />
      </div>
    </div>
  )
}
