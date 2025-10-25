import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
    }))
});

// Mock HTML5 drag and drop API for react-dropzone tests
Object.defineProperty(window, 'DataTransfer', {
    value: class DataTransfer {
        items = {
            add: vi.fn(),
            remove: vi.fn(),
            clear: vi.fn(),
            length: 0
        };
        files: FileList = [] as any;
        types: string[] = [];
        effectAllowed = 'all';
        dropEffect = 'none';

        setData() {}
        getData() {
            return '';
        }
        clearData() {}
    }
});

// Mock File constructor
Object.defineProperty(window, 'File', {
    value: class File extends Blob {
        name: string;
        lastModified: number;
        webkitRelativePath: string;

        constructor(fileBits: BlobPart[], fileName: string, options?: FilePropertyBag) {
            super(fileBits, options);
            this.name = fileName;
            this.lastModified = options?.lastModified || Date.now();
            this.webkitRelativePath = '';
        }
    }
});

// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
    writable: true,
    value: vi.fn(() => 'mock-url')
});

Object.defineProperty(URL, 'revokeObjectURL', {
    writable: true,
    value: vi.fn()
});
