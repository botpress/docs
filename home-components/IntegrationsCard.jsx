export const IntegrationsCard = () => (
  <a href="/integrations/get-started/introduction" className="group cursor-pointer">
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
          className="lucide lucide-plug-icon lucide-plug"
        >
          <path d="M12 22v-5" />
          <path d="M15 8V2" />
          <path d="M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z" />
          <path d="M9 8V2" />
        </svg>
      </div>
      <div>
        <h2
          className="not-prose font-semibold text-base text-gray-800 dark:text-white flex items-center gap-1"
          data-component-part="card-title"
        >
          Integrations
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
          <span data-as="p">Channels to deploy or interact with your agent.</span>
        </div>
      </div>
    </div>
  </a>
)
