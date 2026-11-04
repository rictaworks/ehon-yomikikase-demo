import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { LAYOUT_TEXT } from "@/config/layout"

export default function LoadingIndicator() {
  return (
    <div role="status" aria-label={LAYOUT_TEXT.loadingLabel} className="flex justify-center py-20 text-indigo-400">
      <FontAwesomeIcon icon={faSpinner} spin className="w-10 h-10" />
    </div>
  )
}
