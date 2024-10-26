import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req) {
    try {
        const formData = await req.formData(); // Parse incoming form data
        const uploadedFiles = [];

        // Define the directory to save files locally
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Iterate through formData entries (assuming key 'file' for files)
        for (const [key, value] of formData.entries()) {
            if (key === 'file') {
                const arrayBuffer = await value.arrayBuffer(); // Get ArrayBuffer from each file
                const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer

                // Define a unique file name and path
                const fileName = `${Date.now()}_${value.name}`;
                const filePath = path.join(uploadDir, fileName);

                // Write the file to the local filesystem
                fs.writeFileSync(filePath, buffer);
                
                // Add the local file path to the array of uploaded files
                uploadedFiles.push(`/uploads/${fileName}`);
            }
        }

        // Return success response
        return NextResponse.json({
            success: true,
            message: "Files uploaded successfully",
            files: uploadedFiles,
        });
    } catch (error) {
        console.error("Error saving files locally:", error);
        return new NextResponse("Error saving files locally", { status: 500 });
    }
}
