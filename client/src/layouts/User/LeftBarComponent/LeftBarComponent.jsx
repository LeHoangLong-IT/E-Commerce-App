import "./LeftBarComponent.scss";
import { useEffect, useState } from "react";
import { Collapse } from "antd";
import {
    AppstoreOutlined,
    RightOutlined
} from "@ant-design/icons";

import categoryApi from "../../../api/categoryApi";

const { Panel } = Collapse;

function LeftBarComponent({
    selectedCategory,
    onSelectCategory
}) {

    const [categories, setCategories] = useState([]);
    const [activeKeys, setActiveKeys] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {

        try {

            const res =
                await categoryApi.getAll();

            const data = res.data || [];

            const tree = data
                .filter(
                    item =>
                        item.parent_id === null
                )
                .map(parent => ({
                    ...parent,

                    children:
                        data.filter(
                            child =>
                                child.parent_id ===
                                parent.id
                        )
                }));

            setCategories(tree);

            setActiveKeys(
                tree.map(item =>
                    item.id.toString()
                )
            );

        } catch (error) {

            console.error(error);
        }
    };

    return (
        <div className="leftbar-wrapper">

            <div className="category-box">

                <div className="title">
                    Danh mục sản phẩm
                </div>

                {/* TẤT CẢ */}

                <div
                    className={`child-item all-product ${!selectedCategory
                        ? "active"
                        : ""
                        }`}
                    onClick={() =>
                        onSelectCategory(null)
                    }
                >
                    Tất cả sản phẩm
                </div>

                <Collapse
                    ghost
                    activeKey={activeKeys}
                    onChange={setActiveKeys}
                    expandIconPosition="end"
                    expandIcon={({
                        isActive
                    }) => (
                        <RightOutlined
                            rotate={
                                isActive ? 90 : 0
                            }
                        />
                    )}
                >
                    {categories.map(parent => (

                        <Panel
                            key={parent.id}
                            header={
                                <div
                                    className={`parent-title ${selectedCategory?.id ===
                                        parent.id &&
                                        selectedCategory?.type ===
                                        "parent"
                                        ? "active"
                                        : ""
                                        }`}
                                    onClick={(e) => {

                                        e.stopPropagation();

                                        onSelectCategory({
                                            id: parent.id,
                                            type: "parent"
                                        });
                                    }}
                                >
                                    <AppstoreOutlined />

                                    <span>
                                        {parent.name}
                                    </span>
                                </div>
                            }
                        >
                            <div className="children-list">

                                {parent.children.map(
                                    child => (

                                        <div
                                            key={
                                                child.id
                                            }
                                            className={`child-item ${selectedCategory?.id ===
                                                child.id &&
                                                selectedCategory?.type ===
                                                "child"
                                                ? "active"
                                                : ""
                                                }`}
                                            onClick={() =>
                                                onSelectCategory(
                                                    {
                                                        id: child.id,
                                                        type: "child"
                                                    }
                                                )
                                            }
                                        >
                                            {
                                                child.name
                                            }
                                        </div>

                                    )
                                )}

                            </div>
                        </Panel>

                    ))}
                </Collapse>

            </div>

        </div>
    );
}

export default LeftBarComponent;