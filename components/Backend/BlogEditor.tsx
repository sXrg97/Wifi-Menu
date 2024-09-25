import React, { forwardRef } from 'react';
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import { storage } from '@/utils/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface BlogEditorProps {
  value: string
  onChange: (value: string) => void
}

const BlogEditor = forwardRef<any, BlogEditorProps>((props, ref) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image'
  ]

  return (
    <ReactQuill
      {...props}
      theme="snow"
      modules={modules}
      formats={formats}
    />
  );
});

BlogEditor.displayName = 'BlogEditor';

export default BlogEditor;
