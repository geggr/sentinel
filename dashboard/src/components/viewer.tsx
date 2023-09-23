"use client";

import JsonView from "@uiw/react-json-view"
import { githubLightTheme } from "@uiw/react-json-view/githubLight"

interface ViewerProps {
    data: object
}
export function Viewer({ data }: ViewerProps) {
    return (<JsonView value={data} style={githubLightTheme} displayDataTypes={false} collapsed={false} shortenTextAfterLength={300} />)
}