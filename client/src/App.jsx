import './App.scss';
import { Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import { publicRoutes } from './routes';
import { DefaultLayout } from './components/Layout';

function App() {
    return (
        <Routes>
            {publicRoutes.map((route, index) => {
                const Layout = route.layout === null ? Fragment : DefaultLayout; //dùng để ktra xem layout có null hay không
                const Page = route.component;
                return (
                    <Route
                        key={index}
                        path={route.path}
                        element={
                            <Layout>
                                <Page />
                            </Layout>
                        }
                    />
                );
            })}
        </Routes>
    );
}

export default App;
