import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Row, Col } from "antd";
import {
  CarOutlined,
  EnvironmentOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import { fetchTripImages, planTrip } from "../utils/api";
import toast from "react-hot-toast";
import { BiTrip } from "react-icons/bi";

export function TripForm({ onTripPlanned }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const trip = await planTrip(values);
      const images = await fetchTripImages(values);
      const tripWithImages = { ...trip, images };
      toast.success("Trip planned successfully!");
      onTripPlanned(tripWithImages);
      form.resetFields();
    } catch (error) {
      console.error("Trip planning failed:", error);
      toast.error("Failed to plan trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const presets = React.useMemo(
    () => ({
      milan: {
        startingPoint: "Florence",
        endingPoint: "Milan",
        duration: 1,
        location: "italy",
        numberOfTravellers: 2,
        travelType: "Weekend Getaway",
        travelStyle: "Adventure",
        interests: ["Scenic views", "Wine tasting", "Boat rides"],
        mustHave: [
          "Brunate funicular ride",
          "Franciacorta wine region",
          "Navigli canal boat ride",
          "Tuscany countryside drive",
          "Chianti wine tour",
          "Sunset at Piazzale Michelangelo",
        ],
        requirements: "No early mornings, avoid crowded places",
      },
      weekend: {
        startingPoint: "Milan",
        endingPoint: "Lake Como",
        duration: 2,
        location: "Italy",
        numberOfTravellers: 2,
        travelType: "Weekend Getaway",
        travelStyle: "Romantic",
        interests: ["Scenic views", "Wine tasting", "Boat rides"],
        mustHave: ["Lake Como", "Bellagio", "Riva cruise"],
        requirements: "No early mornings, avoid crowded places",
      },
      swiss: {
        startingPoint: "Zurich",
        endingPoint: "Geneva",
        duration: 7,
        location: "Switzerland",
        numberOfTravellers: 4,
        travelType: "Adventure",
        travelStyle: "Scenic",
        interests: ["Alps", "Chocolate tasting", "Train rides"],
        mustHave: ["Zermatt", "Interlaken", "Glacier Express"],
        requirements: "Include 2 days of hiking, and a spa day",
      },
      beach: {
        startingPoint: "Miami",
        endingPoint: "Bahamas",
        duration: 5,
        location: "Caribbean",
        numberOfTravellers: 2,
        travelType: "Relaxation",
        travelStyle: "Beach",
        interests: ["Swimming", "Snorkeling", "Sunsets"],
        mustHave: ["Nassau", "Cable Beach", "Coral reefs"],
        requirements: "Ocean view hotel, beach massage",
      },
    }),
    []
  );

  const handlePreset = React.useCallback(
    (type) => {
      form.setFieldsValue(presets[type]);
      setSelectedPreset(type);
    },
    [form, presets]
  );

  useEffect(() => {
    handlePreset("milan");
  }, [handlePreset]);

  const PresetButton = ({ icon, label, type }) => (
    <div
      onClick={() => handlePreset(type)}
      className={`cursor-pointer flex-none flex flex-col items-center justify-center
    p-2 sm:p-4 border rounded-xl shadow-md
    w-22 h-20 sm:w-40 sm:h-32 transition hover:shadow-xl
    ${selectedPreset === type ? "border-rose-400 bg-rose-50" : "bg-white"}`}
    >
      <div className="text-xl sm:text-3xl mb-1 sm:mb-2 text-rose-500">
        {icon}
      </div>
      <span className="text-[10px] sm:text-sm font-semibold text-gray-700 text-center">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-100 to-pink-100 p-4 rounded-xl">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-2xl">
        <h2 className="text-lg md:text-2xl font-bold mb-4 text-center text-rose-600 drop-shadow-sm">
          Plan Your Dream Trip
        </h2>

        <div className="flex gap-4 flex-wrap justify-center mb-6">
          <PresetButton
            icon={<BiTrip />}
            label="1 Day Milan Trip"
            type="milan"
          />
          <PresetButton
            icon={<CoffeeOutlined />}
            label="Weekend Trip"
            type="weekend"
          />
          <PresetButton
            icon={<EnvironmentOutlined />}
            label="7-Day Swiss Trip"
            type="swiss"
          />
          <PresetButton
            icon={<CarOutlined />}
            label="Beach Vacation"
            type="beach"
          />
        </div>

        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="startingPoint"
                label="Starting Point"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="endingPoint"
                label="Ending Point"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="duration"
                label="Duration (in days)"
                rules={[{ required: true }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            {selectedPreset !== "solo" && (
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="numberOfTravellers"
                  label="Number of Travellers"
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
            )}
            <Col xs={24} sm={24} md={selectedPreset !== "solo" ? 12 : 24}>
              <Form.Item name="travelType" label="Trip Type">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {(selectedPreset === "milan" ||
            selectedPreset === "swiss" ||
            selectedPreset === "beach" ||
            selectedPreset === "weekend") && (
            <Form.Item name="travelStyle" label="Travel Style">
              <Input />
            </Form.Item>
          )}

          <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item name="interests" label="Interests">
                <Select mode="tags" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item name="mustHave" label="Must-Include">
                <Select mode="tags" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="requirements" label="Other Requirements">
            <Input.TextArea placeholder="e.g. Mix of ferries, driver for a day trip, no strenuous hiking" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Plan Your Trip
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
