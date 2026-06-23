import { useState, useRef } from "react";

export default function ESignUpload(){

    const [selectedFiles, setSelectedFiles] = useState([]);
  
    const [isDragging, setIsDragging] = useState(false);
  
    const fileInputRef = useRef(null);

    const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

    const handleZoneClick = () => {

        if(selectedFiles.length > 0){

            return;
        }
        fileInputRef.current.click();
    };

    const preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if(selectedFiles.length > 0){

            return;
        }
    };

    const handleDragEnter = (e) => {
        preventDefaults(e);
        setIsDragging(true);
    };

    const handleDragOver = (e) => {
        preventDefaults(e);
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        preventDefaults(e);
        setIsDragging(false);
    };

    const handleDrop = (e) => {
    
        preventDefaults(e);
        setIsDragging(false);
    
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      
            processFiles(e.dataTransfer.files);
        }
    };

    const handleFileChange = (e) => {
    
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
        }
    };

    const processFiles = (files) => {
    
        const fileArray = Array.from(files);
        const validFiles = [];

        fileArray.forEach(file => {
        
            if (!ALLOWED_TYPES.includes(file.type)) {
                alert(`File type not allowed: ${file.name}. Only PDF, PNG, and JPG are supported.`);
                return;
            }
            validFiles.push(file);
        });

        if (validFiles.length > 0) {
      
            setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
        }
    };

    const removeFile = (indexToRemove) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="">
            <div
                onClick={handleZoneClick}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full max-w-md p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
            >
                <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold text-indigo-600 hover:text-indigo-500">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                </div>
        
                <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.png,.jpg,.jpeg" 
                    multiple 
                    onChange={handleFileChange}
                />
            </div>

            <div className="mt-4 space-y-2 w-full max-w-md">
                {selectedFiles.map((file, index) => (
                
                    <div key={index} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg text-sm shadow-sm">
                        
                        <div className="flex flex-col truncate pr-2">
                            <span className="truncate font-medium text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        
                        <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); removeFile(index); }} 
                            className="text-red-500 hover:text-red-700 font-medium text-xs px-2 py-1"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}