package main

import (
	"encoding/json"

	"github.com/KevinZonda/GoX/pkg/iox"
	"github.com/KevinZonda/GoX/pkg/panicx"
)

type ConfigModel struct {
	Debug      bool   `json:"debug"`
	ListenAddr string `json:"listen_addr"`
}

var Config ConfigModel

func init() {
	bs, err := iox.ReadAllByte("config.json")
	panicx.NotNilErr(err)
	panicx.NotNilErr(json.Unmarshal(bs, &Config))
}
