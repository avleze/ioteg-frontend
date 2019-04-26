import { openConfirmationDialog } from '../components/ConfirmationDialog';

export default function confirm(onConfirmationFn) {
    openConfirmationDialog(onConfirmationFn);
}