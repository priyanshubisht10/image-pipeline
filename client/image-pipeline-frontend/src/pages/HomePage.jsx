import { useNavigate } from "react-router-dom";

function HomePage() {
   const navigate = useNavigate();

   const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onload = () => {
            navigate("/image", { state: { image: reader.result } });
         };
         reader.readAsDataURL(file);
      }
   };

   return (
      <div className="flex flex-col min-h-screen bg-gray-100">
         <main className="flex-1 flex justify-center items-center">
            <label className="flex flex-col items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
               <span className="mb-1">Upload Image</span>
               <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
               />
            </label>
         </main>
      </div>
   );
};

export default HomePage;
