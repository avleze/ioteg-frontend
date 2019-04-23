import { openSnackbar } from '../components/Notifier';

export default function notify(obj) {
  openSnackbar({variant: "info", ...obj});
}