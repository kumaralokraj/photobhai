export const readableSize = bytes => bytes < 1024 * 1024 ? `${(bytes/1024).toFixed(1)} KB` : `${(bytes/1024/1024).toFixed(2)} MB`;
export function canvasToBlob(canvas, type, quality){return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Image encoding failed')),type,quality));}
export async function processImage(file,{width,height,format,quality,targetKB}){
  const bitmap = await createImageBitmap(file);
  try{
    const canvas = document.createElement('canvas'); canvas.width=width; canvas.height=height;
    const ctx=canvas.getContext('2d'); if(!ctx) throw new Error('Canvas not supported');
    ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
    if(format==='image/jpeg'){ctx.fillStyle='#ffffff';ctx.fillRect(0,0,width,height);}
    ctx.drawImage(bitmap,0,0,width,height);
    if(!targetKB || format==='image/png') return canvasToBlob(canvas,format,quality);
    const target=targetKB*1024;
    let low=0.05,high=Math.min(1,quality),best=null;
    for(let i=0;i<12;i++){
      const q=(low+high)/2,blob=await canvasToBlob(canvas,format,q);
      if(blob.size<=target){best=blob;low=q;}else{high=q;}
    }
    return best || canvasToBlob(canvas,format,0.05);
  }finally{bitmap.close();}
}
