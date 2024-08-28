'use client'

import { useParams } from "next/navigation";

const SortProducts = () => {
  const { categoryIndex } = useParams();

  return (
    <div>{categoryIndex}</div>
  )
}

export default SortProducts