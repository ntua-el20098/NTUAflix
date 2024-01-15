import Link from 'next/link';

function Header() {
  return (
    <div>
        <nav style={{ backgroundColor: '#333333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px' }}>
            <div className="logo" >
                <Link href="/" passHref style={{ color: 'white', textDecoration: 'none'}}>
                <img src="/NTUAflix.png" alt="NTUAflix Logo" style={{ width: '200px' , marginLeft:'20px'}} />
                </Link>
            </div>
            <ul style={{ display: 'flex', listStyle: 'none' }}>
                <li style={{ marginLeft: '20px' }}>
                    <Link href="/titles/searchbygenre" passHref style={{ color: 'white', textDecoration: 'none' }}>
                        Search by Genre
                    </Link>
                </li>
                <li style={{ marginLeft: '30px' }}>
                    <Link href="/titles/searchbyrating" passHref style={{ color: 'white', textDecoration: 'none' }}>
                        Search by Rating
                    </Link>
                </li>
                <li style={{ marginLeft: '30px', marginRight: '50px' }}>
                    <Link href="/people" passHref style={{ color: 'white', textDecoration: 'none' }}>
                        Search People
                    </Link>
                </li>
            </ul>
        </nav>
    </div>
  )
}

export default Header
