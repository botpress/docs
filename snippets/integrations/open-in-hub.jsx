export const OpenInHub = ({integration}) => {
    const {version, id} = integration || {}
    const basePath = 'https://studio.botpress.cloud/home?exploreHub=1&hubItemId='
    const url = `${basePath}${id}`

    return (
        <>
            <a
                className="button rounded-xl"
                href={url}
            >
                <span>
                Open in Hub
                </span>
            </a>
            <i style={{
                margin: "0",
                fontStyle: "normal",
                color: "#666",
                fontSize: "0.85rem",
                padding: '.5rem'
                }}
            >
                v{version}
            </i>
        </>
    )
}