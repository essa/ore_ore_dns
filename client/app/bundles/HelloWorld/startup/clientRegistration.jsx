import ReactOnRails from 'react-on-rails';
import HelloWorldApp from './HelloWorldAppClient';
import ActionButtons from '../components/ActionButtons';
import Logs from '../components/Logs';

// This is how react_on_rails can see the HelloWorldApp in the browser.
ReactOnRails.register({ HelloWorldApp });
ReactOnRails.register(ActionButtons);
ReactOnRails.register({Logs});
