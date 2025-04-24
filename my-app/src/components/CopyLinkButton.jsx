import React, { useState } from "react";
import { Button, Tooltip } from "antd";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

export function CopyLinkButton({ link }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Failed to copy link.");
    }
  };

  return (
    <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
      <Button
        onClick={handleCopy}
        icon={copied ? <CheckOutlined /> : <CopyOutlined />}
        size="small"
        className="ml-2"
      />
    </Tooltip>
  );
}
