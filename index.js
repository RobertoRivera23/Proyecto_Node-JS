const method = process.argv[2]; // GET, POST, PUT, DELETE
const path = process.argv[3]; // Ruta (ruta/id)
const extraData = process.argv.slice(4); // le decimos que Datos adicionales toma desde el indice 4 en adelante

const URL_BASE = 'https://fakestoreapi.com'; // guardamos la URL

// Funcion Asincrona
async function main() {
    if ( !method || !path ) {
        console.log('Debe ingresar los datos <metodo> <recurso> [datos]');
        return;
    }

    // evitamos errores y pasamso a mayusculas
    const methodUpp = method.toUpperCase();

    // Logica de peticiones
    try {
        switch (methodUpp) {
            case 'GET': {
                //  Hacemos peticion GET y pasamos ruta/id
                const response = await fetch(`${URL_BASE}/${path}`, {
                    headers: { 'User-Agent': 'Mozilla/5.0'}
                });
                if (!response.ok) throw new Error(`Hubo un error en la petición: ${response.status} ${response.statusText}`);

                //convertimos los datos del objeto http a objeto y mostramos
                const data = await response.json();
                console.log('Resultado de la consulta GET:');
                console.log(data);
                break;
            }

            case 'POST': {
                // verificamos que contenga ruta a products
                if ( path !== 'products') {
                    console.log('Para hacer un POST debe tener ruta "products"');
                    break;
                }

                // elementos que debe tener el producto creado
                const [title, price, category] = extraData;
                const parsedPrice = Number(price);

                //controlamos que contenga toda la info requerida del producto
                if( !title || !category || Number.isNaN(parsedPrice) || parsedPrice <=0 ) {
                    console.log('Para realizar la peticion debe ingresar: <title>, <price>, <category>');
                    break;
                }

                //Creamos el nuevo producto
                const newProduct = {
                    title,
                    price: parsedPrice,
                    category,
                    description: 'Producto que creamos con Node.js',
                    image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg'
                };

                //Pasamos el nuevo producto
                const response = await fetch(`${URL_BASE}/products`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0'
                    },
                    body: JSON.stringify(newProduct)
                });

                //Cpmrobaos si el POST fue exitoso
                if ( !response.ok ) throw new Error(`Error al crear el producto: ${response.status} ${response.statusText}`)

                //convertimos los datos del objeto http a objeto y mostramos
                const data = await response.json();
                console.log('Producto creado con exito:');
                console.log(data);
                break;
            }

            case 'DELETE': {
                //Validamos que solo reciba products con id numerico, y creamos resourse para no pisar variable global path
                const [resourse, productId] = path.split('/');
                if ( resourse !== 'products' || !productId || Number.isNaN(Number(productId))) {
                    console.log('Para peticionar un DELETE debe usar la ruta "products/<productID>"');
                    break;
                }

                const response = await fetch(`${URL_BASE}/${path}`, {
                    method: 'DELETE',
                    headers: { 'User-Agent': 'Mozilla/5.0'} 
                    });
                
                //comprobamos si hae error    
                if ( !response.ok ) throw new Error(`Error al eliminar: ${response.status} ${response.statusText}`);

                //convertimos y mostramos eliminación exitosa
                const data = await response.json();
                console.log('Producto eliminado (DELETE):');
                console.log(data);
                break;    
            }

            default:
                console.log(`Metodo HTTP no soportado: ${methodUpp}`);
                break;
        }
    } catch (error) {
        console.error(`Ocurrió un error al procesar la solicitud:`, error.message);
    }
}

main();
