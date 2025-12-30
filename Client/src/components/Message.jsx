import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';            
import 'prismjs/components/prism-javascript'   
import 'prismjs/components/prism-python'       

const Message = ({ message, theme }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  return (
    <div>
      {message.role === 'user' ? (
        <div className='flex items-start justify-end my-4 gap-2'>
          <div className={`flex flex-col gap-2 p-2 px-4 border border-[#80609F]/30 rounded-md max-w-2xl
            ${theme === 'dark' ? 'bg-[#57317C]/30' : 'bg-gray-100'}`}>
            <p className='text-sm dark:text-primary'>{message.content}</p>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {message.timestamp.fromNow()}
            </span>
          </div>
          <img src={assets.user_icon} alt="" className='w-8 rounded-full' />
        </div>
      ) : (
        <div className={`inline-flex flex-col gap-2 p-2 px-4 max-w-2xl border border-[#80609F]/30 rounded-md my-4
          ${theme === 'dark' ? 'bg-[#57317C]/30' : 'bg-gray-100'}`}>
          {message.isImage ? (
            <img src={message.content} alt='' className='w-full max-w-md mt-2 rounded-md' />
          ) : (
            <div className='text-sm dark:text-primary reset-tw prose prose-invert max-w-none'>
              <Markdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <pre className={`language-${match[1]} rounded-md p-3`}>
                        <code className={`language-${match[1]}`}>{children}</code>
                      </pre>
                    ) : (
                      <code className={className} {...props}>{children}</code>
                    );
                  }
                }}
              >
                {message.content}
              </Markdown>
            </div>
          )}
          <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>
            {message.timestamp.fromNow()}
          </span>
        </div>
      )}
    </div>
  );
}

export default Message;
