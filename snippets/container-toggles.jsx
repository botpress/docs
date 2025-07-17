import { useState } from 'react'

export const ContainerToggles = () => {
    const [showHeader, setShowHeader] = useState(false)
    const [showMessageList, setShowMessageList] = useState(false)
    const [showComposer, setShowComposer] = useState(false)

    const urls = {
        empty: 'http://localhost:6006/iframe.html?globals=&args=&id=container--empty',
        header: 'http://localhost:6006/iframe.html?globals=&args=&id=container--with-header',
        messageList: 'http://localhost:6006/iframe.html?globals=&args=&id=container--with-message-list',
        composer: 'http://localhost:6006/iframe.html?globals=&args=&id=container--with-composer',
        headerAndMessageList: 'http://localhost:6006/iframe.html?globals=&args=&id=container--with-header-and-message-list',
        headerAndComposer: 'http://localhost:6006/iframe.html?globals=&args=&id=container--with-header-and-composer',
        messageListAndComposer: 'http://localhost:6006/iframe.html?globals=&args=&id=container--with-message-list-and-composer',
        all: 'http://localhost:6006/iframe.html?globals=&args=empty:!false&id=container--with-all',
    }

    const getUrl = () => {
        if (showHeader && showMessageList && showComposer) return urls.all
        if (showHeader && showMessageList) return urls.headerAndMessageList
        if (showHeader && showComposer) return urls.headerAndComposer
        if (showMessageList && showComposer) return urls.messageListAndComposer
        if (showHeader) return urls.header
        if (showMessageList) return urls.messageList
        if (showComposer) return urls.composer
        return urls.empty
    }

    // Helper for toggle button classes
    const getButtonClass = (isActive) =>
        `px-3
        text-gray-700
        dark:text-gray-300
        py-1.5
        border
        border-gray-200
        dark:border-white/[0.07]
        bg-background-light
        dark:bg-background-dark
        hover:bg-primary-dark
        dark:hover:bg-primary-dark
        rounded-xl
        ${isActive ?
            'bg-primary-dark dark:bg-primary-dark text-white dark:text-white'
            : ''}
        `
        
    return (
        <>
            <iframe
                src={getUrl()}
                height="500px"
                className="w-full rounded-xl"
            />
            <div className="flex justify-center gap-4">
                <button
                    className={getButtonClass(showHeader)}
                    onClick={() => setShowHeader(!showHeader)}
                >
                    Header
                </button>
                <button
                    className={getButtonClass(showMessageList)}
                    onClick={() => setShowMessageList(!showMessageList)}
                >
                    Message List
                </button>
                <button
                    className={getButtonClass(showComposer)}
                    onClick={() => setShowComposer(!showComposer)}
                >
                    Composer
                </button>
            </div>
        </>
    )
}
