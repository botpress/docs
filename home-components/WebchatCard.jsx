export const WebchatCard = () => (
  <a href="/webchat/get-started/introduction" className="group cursor-pointer">
    <div className="px-6 py-5 relative flex items-center gap-x-4" data-component-part="card-content-container">
      <div
        className="h-6 w-6 fill-gray-800 dark:fill-gray-100 text-gray-800 dark:text-gray-100"
        data-component-part="card-icon"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-message-square-icon lucide-message-square"
        >
          <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <div>
        <h2
          className="not-prose font-semibold text-base text-gray-800 dark:text-white flex items-center gap-1"
          data-component-part="card-title"
        >
          Webchat
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-right-icon lucide-chevron-right opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </h2>
        <div className="prose font-normal text-sm text-gray-600 dark:text-gray-400 leading-6 mt-0">
          <span data-as="p">Custom frontend for your AI agent.</span>
        </div>
      </div>
    </div>
  </a>
)
