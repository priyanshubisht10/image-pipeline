import { useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

function ImageEditor() {
   const location = useLocation();
   const canvasRef = useRef(null);
   const ctxRef = useRef(null);
   const [brushSize, setBrushSize] = useState(10);
   const [isDrawing, setIsDrawing] = useState(false);

   const originalImage = location.state?.image;

   useEffect(() => {
      if (originalImage) {
         const canvas = canvasRef.current;

   
         const ctx = canvas.getContext("2d");
         ctxRef.current = ctx;

         const img = new Image();


         img.src = originalImage;

         img.onload = () => {

            const maxWidth = window.innerWidth * 0.4;
            const maxHeight = window.innerHeight * 0.8;


            const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
            const width = img.width * scale;
            const height = img.height * scale;
            canvas.width = width;

            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);
         };
      }
   }, [originalImage]);

   const startDrawing = (e) => {
      const { offsetX, offsetY } = e.nativeEvent;
      setIsDrawing(true);
      const ctx = ctxRef.current;
      ctx.strokeStyle = "white";
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.globalCompositeOperation = "source-over";

      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
   };

   const draw = (e) => {
      if (!isDrawing) return;

      const { offsetX, offsetY } = e.nativeEvent;
      const ctx = ctxRef.current;

      ctx.lineTo(offsetX, offsetY);

      ctx.stroke();
   };

   const stopDrawing = () => {
      setIsDrawing(false);
      ctxRef.current.closePath();
   };

   const handleExport = () => {
      const canvas = canvasRef.current;
      const maskDataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = maskDataUrl;

      link.download = "mask.png";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
   };

   const clearCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const img = new Image();
      
      img.src = originalImage;

      img.onload = () => {
         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
         <main className="flex flex-row items-start space-x-8 p-8">
            <div>
               <h2 className="text-center text-lg font-semibold mb-4">Original Image</h2>
               {originalImage && (
                  <img
                     src={originalImage}
                     alt="Original"
                     className="border border-black-800 shadow-lg"
                     style={{
                        maxWidth: "40vw",
                        maxHeight: "80vh",
                        objectFit: "contain",
                     }}
                  />
               )}
            </div>

            <div className="flex flex-row items-start space-x-4">
               <div>
                  <h2 className="text-center text-lg font-semibold mb-4">Edit Mask</h2>
                  <canvas
                     ref={canvasRef}
                     className="border border-gray-300 shadow-lg"
                     onMouseDown={startDrawing}
                     onMouseMove={draw}
                     onMouseUp={stopDrawing}
                     onMouseLeave={stopDrawing}
                  ></canvas>
               </div>

               <div className="flex flex-col items-start space-y-4 mt-8">
                  <div>
                     <label className="block mb-2 font-semibold">Brush Size: {brushSize}px</label>
                     <input
                        type="range"
                        min="5"
                        max="50"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-40"
                     />
                  </div>

                  <div className="flex flex-col space-y-4">
                     <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg"
                     >
                        Export Mask
                     </button>
                     <button
                        onClick={clearCanvas}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg"
                     >
                        Clear
                     </button>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
}

export default ImageEditor;
