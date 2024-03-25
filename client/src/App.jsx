import './App.scss';
import { Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import { privateRoutes, publicRoutes } from './routes';
import { DefaultLayout, DefaultLayoutST } from './components/Layout';

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

            {privateRoutes.map((route, index) => {
                const Layout = route.layout === null ? Fragment : DefaultLayoutST; //dùng để ktra xem layout có null hay không
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
