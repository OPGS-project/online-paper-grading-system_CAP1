import fileDefault from '~~/images/file-blank-solid-240.png';
import fileCSS from '~~/images/file-css-solid-240.png';
import filePdf from '~~/images/file-pdf-solid-240.png';
import filePng from '~~/images/file-png-solid-240.png';

export function getBase64(file) {
    if (!file) return '';
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

export const generateRange = (start, end) => {
    const length = end + 1 - start;
    return Array.from({ length }, (_, index) => start + index);
};

export const ImageConfig = {
    default: fileDefault,
    pdf: filePdf,
    png: filePng,
    css: fileCSS,
};
