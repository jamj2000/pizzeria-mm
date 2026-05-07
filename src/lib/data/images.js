'use server'

import cloudinary from "@/lib/cloudinary";


export async function obtenerImagenes() {
    const result = await cloudinary.api.resources_by_asset_folder('pizzeria', {
        max_results: 500
    });

    return result.resources.map(img => img.secure_url);
}
