import { useEffect } from "react"
import { useProductsStore } from "../stores/products"
import { useParams } from "react-router-dom"

export const CategoryPage = () => {

    const { filteredProducts, getProductsByCategory } = useProductsStore()

    const { category } = useParams()

    useEffect(() => {
        getProductsByCategory(category)
    }, [category, getProductsByCategory])

    console.log(filteredProducts);


    return (
        <div>

        </div>
    )
}
