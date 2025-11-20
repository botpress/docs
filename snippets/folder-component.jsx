export const Files = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`py-3.5 px-4 border border-gray-950\/10 dark:border-white/10 rounded-2xl bg-white dark:bg-codeblock ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const File = ({ name, icon, className = '', ...rest }) => {
  return (
    <div
      className={`flex flex-row items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-default text-zinc-950/80 dark:text-white/80 hover:bg-zinc-100 dark:hover:bg-white/10 ${className}`}
      {...rest}
    >
      <span className="w-4 h-4 inline-flex items-center justify-center flex-shrink-0">
        {icon || <Icon icon="file" />}
      </span>
      <span className="flex-1">{name}</span>
    </div>
  );
};

export const Folder = ({ name, defaultOpen = false, disabled, children, className = '', ...props }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [height, setHeight] = useState('0px');
  const [opacity, setOpacity] = useState(0);
  const contentRef = useRef(null);
  
  useEffect(() => {
    if (contentRef.current) {
      if (defaultOpen) {
        const contentHeight = contentRef.current.scrollHeight;
        setHeight(`${contentHeight}px`);
        setOpacity(1);
      }
    }
  }, [defaultOpen]);
  
  useEffect(() => {
    if (contentRef.current) {
      if (open) {
        const contentHeight = contentRef.current.scrollHeight;
        setHeight(`${contentHeight}px`);
        requestAnimationFrame(() => {
          setOpacity(1);
        });
      } else {
        setOpacity(0);
          setHeight('0px');
      }
    }
  }, [open]);
  
  useEffect(() => {
    if (contentRef.current && open) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(`${contentHeight}px`);
    }
  }, [children, open]);
  
  const handleToggle = () => {
    if (!disabled) {
      setOpen(!open);
    }
  };
  
  return (
    <div className={className} {...props}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`flex flex-row items-center gap-2 rounded-md px-2 py-1.5 text-sm w-full text-left bg-transparent border-none cursor-pointer text-zinc-950/80 dark:text-white/80 hover:bg-zinc-100 dark:hover:bg-white/10 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-expanded={open}
      >
        <span className="w-4 h-4 inline-flex items-center justify-center flex-shrink-0">
          {open ? <Icon icon="folder-open" /> : <Icon icon="folder" />}
        </span>
        <span className="flex-1">{name}</span>
      </button>
      <div
        ref={contentRef}
        className="ml-2 flex flex-col border-l border-gray-950/10 dark:border-white/20 pl-2 overflow-hidden transition-[height,opacity] duration-150 ease-out"
        style={{
          height: height,
          opacity: opacity,
        }}
      >
        {children}
      </div>
    </div>
  );
};

