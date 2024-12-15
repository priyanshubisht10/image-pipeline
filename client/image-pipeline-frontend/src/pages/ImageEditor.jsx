import { useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

function ImageEditor() {
   const location = useLocation();

   const canvasRef = useRef(null);
   const blackCanvasRef = useRef(null);
   const ctxRef = useRef(null);
   const blackCtxRef = useRef(null);

   const [brushSize, setBrushSize] = useState(10);
   const [isDrawing, setIsDrawing] = useState(false);

   const originalImage = location.state?.image;

   useEffect(() => {
      if (originalImage) {
         const canvas = canvasRef.current;

         const blackCanvas = blackCanvasRef.current;
         const ctx = canvas.getContext("2d");
         const blackCtx = blackCanvas.getContext("2d");

         ctxRef.current = ctx;
         blackCtxRef.current = blackCtx;

         const img = new Image();
         img.src = originalImage;

         img.onload = () => {
            const maxWidth = window.innerWidth * 0.3;
            const maxHeight = window.innerHeight * 0.6;

            const scale = Math.min(maxWidth / img.width, maxHeight / img.height);

            const width = img.width * scale;
            const height = img.height * scale;

            canvas.width = width;
            canvas.height = height;

            blackCanvas.width = width;
            blackCanvas.height = height;


            ctx.drawImage(img, 0, 0, width, height);

            blackCtx.fillStyle = "black";

            blackCtx.fillRect(0, 0, width, height);
         };
      }
   }, [originalImage]);

   const startDrawing = (e) => {
      const { offsetX, offsetY } = e.nativeEvent;
      setIsDrawing(true);

      const ctx = ctxRef.current;

      const blackCtx = blackCtxRef.current;

      ctx.strokeStyle = "white";
      ctx.lineWidth = brushSize;

      ctx.lineCap = "round";


      ctx.globalCompositeOperation = "source-over";

      blackCtx.strokeStyle = "white";
      blackCtx.lineWidth = brushSize;

      blackCtx.lineCap = "round";
      blackCtx.globalCompositeOperation = "source-over";

      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);

      blackCtx.beginPath();

      blackCtx.moveTo(offsetX, offsetY);
   };

   const draw = (e) => {
      if (!isDrawing) return;

      const { offsetX, offsetY } = e.nativeEvent;
      const ctx = ctxRef.current;

      const blackCtx = blackCtxRef.current;

      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();

      blackCtx.lineTo(offsetX, offsetY);
      blackCtx.stroke();
   };

   const stopDrawing = () => {
      setIsDrawing(false);
      ctxRef.current.closePath();

      blackCtxRef.current.closePath();
   };

   const handleExport = () => {
      const canvas = canvasRef.current;
      const maskDataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = maskDataUrl;
      link.download = "edit-mask.png";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   const handleBlackCanvasExport = () => {
      const blackCanvas = blackCanvasRef.current;
      const blackDataUrl = blackCanvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = blackDataUrl;

      link.download = "image-mask.png";

      document.body.appendChild(link);

      link.click();
      document.body.removeChild(link);
   };

   const clearCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      const blackCanvas = blackCanvasRef.current;
      const blackCtx = blackCtxRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      blackCtx.clearRect(0, 0, blackCanvas.width, blackCanvas.height);

      const img = new Image();
      img.src = originalImage;

      img.onload = () => {
         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
         blackCtx.fillStyle = "black";
         blackCtx.fillRect(0, 0, blackCanvas.width, blackCanvas.height);
      };
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">

         <main className="flex flex-row items-start space-x-8 p-8">

            <div>

               <h2 className="text-center text-lg font-semibold mb-4">Original Image</h2>
               {originalImage && (
                  <img src={originalImage}
                     alt="Original"
                     className="border border-black-800 shadow-lg"
                     style={{
                        maxWidth: "30vw",
                        maxHeight: "60vh",
                        objectFit: "contain",
                     }}
                  />
               )}


               <div className="mt-4">
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
            </div>

            <div className="flex flex-row items-start space-x-4">
               <div>

                  <h2 className="text-center text-lg font-semibold mb-4">Edit Mask</h2>
                  <canvas
                     ref={canvasRef}
                     onMouseUp={stopDrawing}
                     className="border border-gray-300 shadow-lg"
                     onMouseMove={draw}
                     onMouseDown={startDrawing}

                     onMouseLeave={stopDrawing}

                  ></canvas>
                  <button
                     onClick={handleExport}
                     className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg w-full"
                  >
                     Export Mask
                  </button>
               </div>

               {<div>


                  <h2 className="text-center text-lg font-semibold mb-4">Black Canvas</h2>
                  <canvas
                     ref={blackCanvasRef}

                     className="border border-gray-300 shadow-lg"
                  ></canvas>
                  <button
                     onClick={handleBlackCanvasExport}

                     className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg w-full"
                  >
                     Export Mask
                  </button>
               </div>}
            </div>

         </main>
         <div className="flex flex-col items-start space-y-4">
            <button

               onClick={clearCanvas}
               className="mt-8 px-4 py-2 bg-red-600 text-white rounded-lg"
            >
               Clear
            </button>
         </div>

      </div>
   );
}

export default ImageEditor;
