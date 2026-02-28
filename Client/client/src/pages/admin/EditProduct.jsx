import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`/products/get/${id}`);
      setForm(res.data);
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    try{
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category", form.category);

    images.forEach((img) => {
      formData.append("images", img);
    });
    console.log(formData);

    await axios.put(`/products/update/${id}`, formData, {
        
      headers: { "Content-Type": "multipart/form-data" }
    });

    navigate("/admin/products");

    } catch(error){
        console.log(`Error in handleSubmit Edit Product ${error}`)
    }
    
  };

  if (!form.name) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="w-full"
        />

        <button className="bg-black text-white px-6 py-2 rounded">
          Update Product
        </button>

      </form>
    </div>
  );
}

export default EditProduct;