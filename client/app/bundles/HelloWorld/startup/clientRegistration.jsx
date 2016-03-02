import ReactOnRails from 'react-on-rails';
import HelloWorldApp from './HelloWorldAppClient';
import StatusMessage from '../components/StatusMessage';
import StartButton from '../components/StartButton';

// This is how react_on_rails can see the HelloWorldApp in the browser.
ReactOnRails.register({ HelloWorldApp });
ReactOnRails.register({ StatusMessage, StartButton });
