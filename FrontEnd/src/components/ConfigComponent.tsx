import './ConfigComponent.css'

interface ConfigComponentProps {
    onClose: () => void;
    onLogout: () => void;
}

export default function ConfigComponent({ onClose, onLogout }: ConfigComponentProps) {

    return (
        <div className='configOverlay'>
            <div className='configComponent'>
                <div className='closeButtonDiv'>
                    <button className='closeButton' onClick={onClose}>X</button>
                </div>
                <h1>Configurations</h1>
                <div className='logoutButtonDiv'>
                    <button className='logoutButton' onClick={onLogout}>Logout</button>
                </div>
            </div>
        </div>
    )
}