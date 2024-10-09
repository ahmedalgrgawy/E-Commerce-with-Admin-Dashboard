import { useEffect } from "react"
import { useProductsStore } from "../stores/products"

export const CategoryPage = () => {

    const { filteredProducts, getProductsByCategory } = useProductsStore()

    useEffect(() => {
        getProductsByCategory('bags')
    }, [getProductsByCategory])

    console.log(filteredProducts);

    return (
        <div>

        </div>
    )
}
